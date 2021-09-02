module.exports = function (plop) {
  // create your generators here
  plop.setGenerator('page', {
    description: '生成页面',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '页面名称',
      },
    ], // array of inquirer prompts
    actions: (data) => {
      const name = '{{ name }}'
      const actions = [
        {
          type: 'add',
          path: `src/pages/${name}/index.html`,
          templateFile: 'plop-templates/index.hbs',
          data: {
            name: name,
          },
        },
        {
          type: 'add',
          path: `src/pages/${name}/index.js`,
          templateFile: 'plop-templates/index.js',
          data: {
            name: name,
          },
        },
        {
          type: 'add',
          path: `src/pages/${name}/index.scss`,
          templateFile: 'plop-templates/index.scss',
          data: {
            name: name,
          },
        },
      ]
      return actions
    },
  })
}
