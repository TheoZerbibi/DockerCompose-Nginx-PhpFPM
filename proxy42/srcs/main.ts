import express from 'express';
import morgan from 'morgan';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
const oauth = require('axios-oauth-client');
import axios from 'axios';
import { setTimeout } from 'timers/promises';

import config from './config/config.json';

const app = express();

const PORT = 3000;
const HOST = "0.0.0.0";
const API_SERVICE_URL = "https://api.intra.42.fr/v2";

let Token = {
	'access_token': "",
	'expires_in': 0,
	'created_at': 0
}

let remaining_request = 2;

app.use(morgan('dev'));

app.get('/info', (_req: any, res: { send: (arg0: string) => void; }, _next: any) => {
	res.send('This is a proxy service which made request to 42 API\n');
});

async function getAccesToken():Promise<any> {
	const promise = await oauth.client(axios.create(), {
		url: 'https://api.intra.42.fr/oauth/token',
		grant_type: 'client_credentials',
		client_id: config.API.client_id,
		client_secret: config.API.client_secret,
	})
	await promise().catch((error: any) => {
		console.log(`Status : ${error.response.status} | ${error.response.statusText}`);
		console.log(error.response.data);
		process.exit(1);
	}).then((response: any) => {
		Token.access_token = response.access_token;
		Token.expires_in = parseInt(response.expires_in);
		Token.created_at = parseInt(response.created_at);
		return(Token)
	});
}

app.use(async (req:any, res:any, next:any) => {
	if (req.headers.authorization && req.headers.authorization == config.password) {
		await getAccesToken();
		delete req.headers['authorization'];
		req.headers['Authorization'] = `Bearer ${Token.access_token}`;
		if (remaining_request <= 0) {
			console.log("Wait too many request");
			await setTimeout(1000);
		}
		next();
	} else {
		res.sendStatus(403);
	}
});

app.use('/api', createProxyMiddleware({
	target: API_SERVICE_URL,
	changeOrigin: true,
	selfHandleResponse: true,
	onProxyRes: responseInterceptor(async (responseBuffer:any, proxyRes:any, req:any, res:any) => {	
			const response = responseBuffer.toString('utf8');
			remaining_request = parseInt(proxyRes.headers['x-secondly-ratelimit-remaining']);
			return (response);
	}),
	pathRewrite: {
		[`^/api`]: '',
	},
 }));
 
 app.listen(PORT, HOST, () => {
	console.log(`Starting Proxy at ${HOST}:${PORT}`);
});