import $ from 'jquery';

class Request {
    async get(url) {
        let result;
        try {
            await $.ajax({
                url,
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                success: (msg) => {
    
                },
                complete: (res) => {
                    try {
                        result = JSON.parse(res.responseText);
                    }catch(e) {
                        return {
                            success: '',
                            error: 'Something went wrong'
                        }
                    }
                }
            });
            return result;
        } catch (error) {
            return {
                success: '',
                error: 'Something went wrong while making ajax call'
            }
        }
    }

    async post(url, data) {
        let result;
        try {
            await $.ajax({
                url,
                type: 'POST',
                data,
                xhrFields: {
                    withCredentials: true
                },
                success: (msg) => {
    
                },
                complete: (res) => {
                    try {
                        result = JSON.parse(res.responseText);
                    }catch(e) {
                        result = {
                            success: '',
                            error: 'Something went wrong'
                        }
                    }
                }
    
            });
        }catch(e) {
            result = {
                success: '',
                error: 'Something went wrong while making ajax call'
            }
        }

        return result;
    }
}

export default new Request();