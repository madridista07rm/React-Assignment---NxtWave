import axios from "axios";

const fetchListData = async () => {
    try {
        const response = await axios.get("https://apis.ccbp.in/list-creation/lists");
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error
    }


};



export { fetchListData };