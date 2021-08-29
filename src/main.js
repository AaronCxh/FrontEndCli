/* eslint-disable one-var */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
import './main.scss'

// if (document.querySelector('.changePsw')) {
//   import('./pages/changePsw/changePsw.js').then((res) => {
//     console.log(res)
//   })
// }
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

function getQueryStringArgs() {
  //取得查询字符串并去掉开头的问号
  let qs = location.search.length > 0 ? location.search.substring(1) : '',
    //保存数据的对象
    args = {},
    //取得每一项
    items = qs.length ? qs.split('&') : [],
    item = null,
    name = null,
    value = null,
    //在 for 循环中使用
    i = 0,
    len = items.length
  //逐个将每一项添加到 args 对象中
  for (i = 0; i < len; i++) {
    item = items[i].split('=')
    name = decodeURIComponent(item[0])
    value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value
    }
  }
  return args
}
Vue.use(ElementUI)
new Vue({
  el: '#app',
  data: {
    updateLevel: false,
    answerInfo: {},
    skillList: [],
    agress: false,
    one: 50,
    percentage: 0,
    show: false,
    isCodeLogin: false,
    radio: '-1',
    skillStatus: -1,
    disabled: true,
    screenWidth: null,
    popperIndex: -1,
    qrcode: false,
    question: {},
    answers: [],
    checkedQuestion: [],
    errorTip: [],
    args: null,
    isPractice: false,
  },
  created() {
    this.screenWidth = document.documentElement.clientWidth
    this.args = getQueryStringArgs()
    window.model = {
      alert: this.$alert,
      confirm: this.$confirm,
      prompt: this.$prompt,
      msgbox: this.$msgbox,
      loading: this.$loading,
    }
    if (document.querySelector('#skill')) {
      this.getquestion()
    }
    if (document.querySelector('#skill-practice')) {
      this.isPractice = true
      this.getPracticeQuestion()
    }
    if (document.querySelector('#skill-question')) {
      this.getSkillList()
    }
  },
  mounted() {
    window.onresize = () => {
      // 定义窗口大小变更通知事件
      this.screenWidth = document.documentElement.clientWidth
    }
    document.onclick = () => {
      this.popperIndex = -1
    }
  },
  computed: {
    isActive: function () {
      return this.show
    },
  },
  methods: {
    oncheckedChange(e) {
      this.disabled = false
    },
    getSkillList() {
      const temp = {
        apiname: 'getcourseunit',
        courseid: config.cid,
      }
      if (this.args.customrdsession) {
        temp.customrdsession = encodeURIComponent(this.args.customrdsession)
        temp.iswechat = '1'
        temp.encrypttime = encodeURIComponent(this.args.encrypttime)
      }
      $.ajax({
        url: config.url,
        data: Object.assign({}, temp),
        success: (res) => {
          console.log('list', res)
          let data = res.datalist
          let first = data.splice(0, 1)
          if (data % 2) {
            let last = data.splice(data.length - 1)
            let temp = data
              .map((item, i) => {
                return i % 2 ? null : data.slice(i, i + 2)
              })
              .filter(Boolean)
            this.skillList = [first, ...temp, last]
          } else {
            let temp = data
              .map((item, i) => {
                return i % 2 ? null : data.slice(i, i + 2)
              })
              .filter(Boolean)
            this.skillList = [first, ...temp]
          }

          // console.log(temp, first, last)
        },
      })
    },
    getPracticeQuestion() {
      const temp = {
        apiname: 'getquestionbuyunit',
        uid: config.uid,
      }
      if (this.args.customrdsession) {
        temp.customrdsession = encodeURIComponent(this.args.customrdsession)
        temp.iswechat = '1'
        temp.encrypttime = encodeURIComponent(this.args.encrypttime)
      }
      this.question.AutoID &&
        (temp.allids = this.question.allids) &&
        (temp.waitids = this.question.waitids)

      $.ajax({
        url: config.url,
        dataType: 'json',
        data: Object.assign({}, temp),
        success: (res) => {
          console.log(res)
          if (res.ret === 'success') {
            this.errorTip = res.Options.filter((item) => {
              return item.IsAnswer
            })
            this.question = res
            this.percentage = (res.CompletedNum / res.TotalNum) * 100
          }
        },
        fail: (err) => {
          console.error(err)
        },
      })
    },
    getquestion() {
      const temp = {
        apiname: 'getquestion',
        eid: config.eid,
      }
      if (this.args.customrdsession) {
        temp.customrdsession = encodeURIComponent(this.args.customrdsession)
        temp.iswechat = '1'
        temp.encrypttime = encodeURIComponent(this.args.encrypttime)
      }
      console.log('请求参数', temp)
      $.ajax({
        url: config.url,
        dataType: 'json',
        data: Object.assign({}, temp),
        success: (res) => {
          console.log(res)
          if (res.ret === 'success') {
            this.errorTip = res.Options.filter((item) => {
              return item.IsAnswer
            })
            this.question = res
            this.percentage = (res.CompletedNum / res.TotalNum) * 100
          }
        },
        fail: (err) => {
          console.error(err)
        },
      })
    },
    checkQuestionStatus() {
      const { question, checkedQuestion, radio } = this
      const temp = {
        apiname: 'getoptionsinfo',
        qid: this.question.AutoID,
        options: question.Type === 0 ? radio : checkedQuestion.join(','),
        eid: config.eid,
      }
      if (this.args.customrdsession) {
        temp.customrdsession = encodeURIComponent(this.args.customrdsession)
        temp.iswechat = '1'
        temp.encrypttime = encodeURIComponent(this.args.encrypttime)
      }
      return $.ajax({
        url: config.url,
        dataType: 'json',
        data: Object.assign({}, temp),
        success: (res) => {
          if (res.ret === 'success') {
            // this.getquestion()
          } else {
          }
        },
        fail: (err) => {
          console.error(err)
        },
      })
    },
    checkPracticeQuestionStatus() {
      const { question, checkedQuestion, radio } = this
      const temp = {
        apiname: 'getreplyquestionbuyunit',
        qid: this.question.AutoID,
        options: question.Type === 0 ? radio : checkedQuestion.join(','),
        uid: config.uid,
        allids: this.question.allids,
        waitids: this.question.waitids,
      }
      if (this.args.customrdsession) {
        temp.customrdsession = encodeURIComponent(this.args.customrdsession)
        temp.iswechat = '1'
        temp.encrypttime = encodeURIComponent(this.args.encrypttime)
      }
      return $.ajax({
        url: config.url,
        dataType: 'json',
        data: Object.assign({}, temp),
        success: (res) => {
          if (res.ret === 'success') {
            // this.getquestion()
          } else {
          }
        },
        fail: (err) => {
          console.error(err)
        },
      })
    },
    toggerLoginType() {
      console.log(213)
      this.isCodeLogin = !this.isCodeLogin
    },
    onSubmit() {
      console.log(this.isActive)
      const { question } = this
      if (this.isPractice) {
        this.checkPracticeQuestionStatus().then((res) => {
          this.question.allids = res.allids
          this.question.waitids = res.waitids
          if (res.status === 200) {
            this.skillStatus = 1
            this.percentage = (res.CompletedNum / question.TotalNum) * 100
            if (this.percentage === 100) {
              this.onNext()
            }
          } else {
            this.skillStatus = 0
          }
          this.show = true
          this.checkAnswer(res.status)
        })
      } else {
        this.checkQuestionStatus().then((res) => {
          const { answerInfo } = this
          console.log(res, answerInfo)

          if (
            answerInfo.CompleteLevel &&
            answerInfo.CompleteLevel !== res.CompleteLevel
          ) {
            this.updateLevel = true
          } else {
            this.updateLevel = false
          }
          console.log('this.updateLevel', this.updateLevel)
          if (res.status === 200) {
            this.skillStatus = 1
            this.percentage = (res.CompletedNum / question.TotalNum) * 100
            if (this.percentage === 100) {
              this.onNext()
            }
            this.$nextTick(() => {
              this.answerInfo = res
            })
          } else {
            this.skillStatus = 0
          }
          this.show = true
          this.checkAnswer(res.status)
        })
      }
    },
    onNext() {
      console.log('下一题')
      this.radio = ''
      this.checkedQuestion = []
      this.skillStatus = -1
      this.show = false
      this.disabled = true
      this.isPractice ? this.getPracticeQuestion() : this.getquestion()
    },
    checkAnswer(status) {
      // eslint-disable-next-line no-constant-condition
      if (status === 0) {
        this.$refs.failAudio.play()
      } else {
        this.$refs.successAudio.play()
      }
    },
    onChange(e) {
      this.disabled = false
    },
    onNavTo(e) {
      console.log(e)
    },
    open() {
      this.qrcode = !this.qrcode
    },
  },
})
