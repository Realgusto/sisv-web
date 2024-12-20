type FetchParams = {
    URL: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: BodyInit
}

export default function FetchAPI({ URL, method, body }: FetchParams) {
    return fetch(URL, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '430ec2fc-5060-414b-aa41-7747d507e892',
        },
        body: body
    })
}