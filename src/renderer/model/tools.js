import md5 from 'js-md5'

const app = {

    config: {
        apiUrl: "http://www.apiying.com/yuqing/"
    },
    storage: {

        set(key, value) {

            localStorage.setItem(key, JSON.stringify(value));
        },
        get(key) {

            let result = localStorage.getItem(key);
            return result ? JSON.parse(result) : "";
        },
        remove(key) {
            localStorage.removeItem(key)
        }
    },

    /*
    {
                'a':'addKeywords',
                'uid':userinfo.id,
                'salt':userinfo.salt
    }
    */
    sign(json) {

        let arr = [];
        for (let i in json) {
            arr.push(i);
        }

        // arr=['uid','a','salt']


        //如果这个参数被省略，那么元素将按照 ASCII 字符顺序进行升序排列（也就是所谓的自然顺序）
        arr = arr.sort();

        //arr=['a','salt','uid']

        let str = '';
        for (let i = 0; i < arr.length; i++) {
            str += arr[i] + json[arr[i]]
        }


        //aaddKeywordssalt214214124125125uid2

        return md5(str);
    }
}

export default app;