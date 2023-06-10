
// const url = process.env.REACT_APP_SERVER_URL + '/posts/';
const url = '/api/posts/';

export const addPost = async (content) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// 'Authorization': await getAuthHeader()
		},
		body: JSON.stringify(content)
	});

	const data = await response.json();
	if (!response.ok) {
		const errorMsg = data?.message;
		throw new Error(errorMsg)
	}

	return data;
};

export const getPost = async (postId) => {
	const link = url + postId;
	const response = await fetch(link, {
		method: 'GET',
		headers: {
			// 'Authorization': await getAuthHeader()
		}
	});
	return response.json();
};

export const getPosts = async () => {
	const link = url;
	const response = await fetch(link, {
		method: 'GET',
		headers: {
			// 'Authorization': await getAuthHeader()
		}
	});
	return response.json();
};

export const deletePost = async (postId) => {
	const link = url + postId;
	const response = await fetch(link, {
		method: 'DELETE',
		// 'Authorization': await getAuthHeader()
	});

	const data = await response.json();
	if (!response.ok) {
		const errorMsg = data?.message;
		throw new Error(errorMsg)
	}
	return data;
};

export const updatePost = async (postId, content) => {
	const link = url + postId;
	const response = await fetch(link, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			// 'Authorization': await getAuthHeader()
		},
		body: JSON.stringify(content)
	});

	const data = await response.json();
	if (!response.ok) {
		const errorMsg = data?.message;
		throw new Error(errorMsg)
	}
	return data;
};

export default {
	addPost: addPost,
	getPost: getPost,
	deletePost: deletePost,
	updatePost: updatePost,
};
