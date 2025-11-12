import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/4070Svelte';
const client = new MongoClient(MONGODB_URI);

let clientPromise;

if (!global._mongoClientPromise) {
	clientPromise = client.connect();
	global._mongoClientPromise = clientPromise;
} else {
	clientPromise = global._mongoClientPromise;
}

export async function getDatabase() {
	const client = await clientPromise;
	return client.db('4070Svelte');
}
