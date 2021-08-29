module.exports = function (plop) {
  // create your generators here
  plop.setGenerator('page', {
    description: 'generate a page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'page name please',
      },
      // {
      //   type: 'checkbox',
      //   name: 'blocks',
      //   message: 'Blocks:',
      //   choices: [
      //     {
      //       name: '<template>',
      //       value: 'template',
      //       checked: true,
      //     },
      //     {
      //       name: '<script>',
      //       value: 'js',
      //       checked: true,
      //     },
      //     {
      //       name: 'style',
      //       value: 'scss',
      //       checked: true,
      //     },
      //   ],
      //   validate(value) {
      //     if (
      //       value.indexOf('script') === -1 &&
      //       value.indexOf('template') === -1
      //     ) {
      //       return 'View require at least a <script> or <template> tag.'
      //     }
      //     return true
      //   },
      // },
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
