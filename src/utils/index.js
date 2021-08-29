/* eslint-disable no-undef */
export function getQuestionList(courseid) {
  $.ajax({
    url: '/Include/Weixin/GetWeiXinData.aspx',
    data: {
      apiname: 'getcourseunit',
      courseid: courseid,
    },
    success: (res) => {
      console.log(res)
    },
  })
}
