const url = process.env.REACT_APP_SERVER_URL + '/users/';

export const getPostsBasedOnUserId = async (userId) => {
	const link =  url + userId + "/posts";
	const response = await fetch(link, {
		method: 'GET',
		headers: {
			// 'Authorization': await getAuthHeader()
		}
	});
	return response.json();
};

export const addUser = async () => {
	const link =  url;
	const response = await fetch(link, {
		method: 'POST',
		headers: {
			// 'Authorization': await getAuthHeader()
		}
	});
	return response.json();
};

export const getUserBasedOnFirebaseId = async (userId) => {
	const link = url + userId;
	const response = await fetch(link, {
		method: 'GET',
		headers: {
			// 'Authorization': await getAuthHeader()
		}
	});
	return response.json();
};

export const deleteUserBasedOnUserId = async (userId) => {
	const link = url + userId;
	const response = await fetch(link, {
		method: 'DELETE',
		headers: {
			// 'Authorization': await getAuthHeader()
		}
	});
	const data = await response.json();
	if (!response.ok) {
		const errorMsg = data?.message;
		throw new Error(errorMsg)
	}
	return data;
};

export const updateUserBasedOnUserId = async (content) => {
	const link = url + content.userId;
	const response = await fetch(link, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			// 'Authorization': await getAuthHeader()
		},
		body: JSON.stringify(content.updateContents)
	});

	const data = await response.json();
	if (!response.ok) {
		const errorMsg = data?.message;
		throw new Error(errorMsg)
	}
	return data;
};

export default {
	getPostsBasedOnUserId: getPostsBasedOnUserId,
	getUserBasedOnUserId: getUserBasedOnFirebaseId,
	deleteUserBasedOnUserId: deleteUserBasedOnUserId,
	updateUserBasedOnUserId: updateUserBasedOnUserId
};