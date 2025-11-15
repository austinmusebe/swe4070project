import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

let client;
let clientPromise;

if (!client) {
	client = new MongoClient(MONGODB_URI);
	clientPromise = client.connect();
}

export async function getDb() {
	await clientPromise;
	return client.db('4070Svelte');
}
