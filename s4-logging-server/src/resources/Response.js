
const IGNORE_LIST = ['id'];

export function clean(completeData, addionalKeys = []) {
    let data = JSON.parse(JSON.stringify(completeData));

    let ignoreList = IGNORE_LIST.concat(addionalKeys);

    if(Array.isArray(data)) {
        data.forEach(dataItem => {
            ignoreList.forEach(ignoreItem => {
                delete dataItem[ignoreItem];
            })
        });
        return data;
    }
    ignoreList.forEach(ignoreItem => {
        delete data[ignoreItem];
    });
    return data;
}