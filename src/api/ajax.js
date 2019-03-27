import request from '@/utils/request'
  //未来航班销售监控
export function RepFutureFlightSell(data) {
    return request({
      url: '/api/RepFutureFlightSell',
      method: 'post',
      data
    })
  }
    //竞飞航班上客速度报表
export function RepCompetingFlights(data) {
    return request({
      url: '/api/RepCompetingFlights',
      method: 'post',
      data
    })
  }
    //-1天承运航班收入
export function RepFlightflyIncome(data) {
    return request({
      url: '/api/RepFlightflyIncome',
      method: 'post',
      data
    })
  }
      //-1天承运航班收入明细
export function RepFlightflyIncomeDetail(data) {
    return request({
      url: '/api/RepFlightflyIncomeDetail',
      method: 'post',
      data
    })
  }