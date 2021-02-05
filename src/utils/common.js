const ora = require('ora');
const axios = require('axios');
const { downloadDirectory } = require('./constants.js')
const { promisify } = require('util');
// 根据我们想要实现的功能配置执行动作，遍历产生对应的命令
const mapActions = {
    create: {
        alias: 'c', //别名
        description: '创建一个项目', // 描述
        examples: [ //用法
            'lee-cli create <project-name>'
        ]
    },
    config: { //配置文件
        alias: 'conf', //别名
        description: 'config project variable', // 描述
        examples: [ //用法
            'lee-cli config set <k> <v>',
            'lee-cli config get <k>'
        ]
    },
    '*': {
        alias: '', //别名
        description: 'command not found', // 描述
        examples: [] //用法
    }};
// 封装loading效果
const fnLoadingByOra = (fn, message='执行命令中。。。') => async (...argv)=> {
    const spinner = ora(message);
    spinner.start();
    let result = await fn(...argv);
    spinner.succeed(); // 结束loading
    return result;
}
// 获取版本号
const getTagLists =  async (repo) =>{
    const {data} = await axios.get(`https://api.github.com/repos/lxy-cli/${repo}/tags`);
    return data;
}
let downloadGit = require('download-git-repo');
downloadGit = promisify(downloadGit);// 将项目下载到当前用户的临时文件夹下
const downDir = async (repo,tag)=>{
    console.log(tag, 'downDir方法');
    let project = `lxy-cli/${repo}`; //下载的项目
    if(tag){
        project += `#${tag}`;
    }
    //     c:/users/lee/.myTemplate
    let dest = `${downloadDirectory}/${repo}`;
    //把项目下载当对应的目录中
    console.log(dest, 'dest的内容。。。。。。。。。。');
    console.log(project, 'dest的内容。。。。。。。。。。');
    try {
        await downloadGit(project, dest);
    } catch (error) {
        console.log('错误了吗？？？\n');
        console.log(error);
    }
    return dest;
}
module.exports = {
    mapActions,
    fnLoadingByOra,
    getTagLists,
    downDir
};
