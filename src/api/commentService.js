const API_BASE_URL = "http://localhost:8000/api";

const getAuthToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("authToken");
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

export const likeComment = async (commentId) => {
  try {
    const result = await fetchWithAuth(
      `${API_BASE_URL}/comments/${commentId}/like`,
      {
        method: "POST",
      }
    );

    return {
      likes: result.likes,
      dislikes: result.dislikes,
      userVote: "liked",
    };
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
};

export const dislikeComment = async (commentId) => {
  try {
    const result = await fetchWithAuth(
      `${API_BASE_URL}/comments/${commentId}/dislike`,
      {
        method: "POST",
      }
    );

    return {
      likes: result.likes,
      dislikes: result.dislikes,
      userVote: "disliked",
    };
  } catch (error) {
    console.error("Error disliking comment:", error);
    throw error;
  }
};

export const removeVote = async (commentId) => {
  try {
    const result = await fetchWithAuth(
      `${API_BASE_URL}/comments/${commentId}/vote`,
      {
        method: "DELETE",
      }
    );

    return {
      likes: result.likes,
      dislikes: result.dislikes,
      userVote: null,
    };
  } catch (error) {
    console.error("Error removing vote:", error);
    throw error;
  }
};

export const getComments = async (articleId) => {
  try {
    const result = await fetchWithAuth(
      `${API_BASE_URL}/articles/${articleId}/comments`
    );
    return result.comments || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addComment = async (articleId, content, parentId = null) => {
  try {
    const result = await fetchWithAuth(
      `${API_BASE_URL}/articles/${articleId}/comments`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          parent_id: parentId,
        }),
      }
    );

    return result.comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
