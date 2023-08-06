import axios from "axios";
const URL ='https://pixabay.com/api/';
const KEY = '38681810-9a82a3e545815a3f315d09dbf';

export async function searchPhoto(q, page, perPage) {
    const url = `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;          
};