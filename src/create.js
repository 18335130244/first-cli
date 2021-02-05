const axios = require('axios');
var inquirer = require('inquirer')
var ora = require('ora')
const { fnLoadingByOra , getTagLists , downDir } =require('./utils/common')
// 1).获取仓库列表
const fetchReopLists = async () => {
    // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
    const { data } = await axios.get('https://api.github.com/orgs/lxy-cli/repos');  return data
};

module.exports = async (projectName) => {
    console.log(projectName);
    let repos = await fnLoadingByOra(fetchReopLists,'链接仓库中')();
    repos = repos.map((item) => item.name);
    console.log(repos);
    const { repo} = await inquirer.prompt([
        {
            type: 'list',
            name:'repo',
            message:'请选择一个你要创建的项目',
            choices: repos
        }
    ]);
    console.log(`我现在选择了那个仓库？ ${repo}`);
    let tags = await fnLoadingByOra(getTagLists,'链接你选择的的仓库')(repo)
    tags = tags.map((item) => item.name);
    const { tag } = await inquirer.prompt([{
        type: 'list',
        name: 'tag',
        message: '请选择一个该项目的版本下载',
        choices: tags
    }]);
    console.log(`选择仓库的版本号${tag}`);
    const target = await fnLoadingByOra(downDir, '下载项目中...')(repo, tag);
    console.log(target);
};
