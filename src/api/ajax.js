import request from '@/utils/request'
  //未来航班销售监控
export function RepFutureFlightSell(data) {
    return request({
      url: '/api/RepFutureFlightSell',
      method: 'post',
      data
    })
  }
    //未来航班上客速度报表
export function RepCompetingFlights(data) {
    return request({
      url: '/api/RepCompetingFlights',
      method: 'post',
      data
    })
  }

    //最低价
    export function LowestPrice(data) {
      return request({
        url: '/api/LowestPrice',
        method: 'post',
        data
      })
    }

        //客座率
export function CrowRate(data) {
  return request({
    url: '/api/CrowRate',
    method: 'post',
    data
  })
}



  //客座率当天抓取明细
  export function CrowRateSameDayDetail(data) {
    return request({
      url: '/api/CrowRateSameDayDetail',
      method: 'post',
      data
    })
  }
  //携程最低价当天抓取明细
  export function LowestPriceSameDayDetail(data) {
    return request({
      url: '/api/LowestPriceSameDayDetail',
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
  //竞飞航班上客速度报表导出
  export function RepCompetingFlightsExcel(query) {
    return request({
      url: '/api/RepCompetingFlights/excel2',
      method: 'get',
      params: query
    })
  }
    //-1天承运航班收入导出
    export function RepFlightflyIncomeExcel(query) {
      return request({
        url: '/api/RepFlightflyIncome/excel',
        method: 'get',
        params: query
      })
    }
    //未来航班上客速度报表导出
  export function RepFutureFlightSellExcel(query) {
    return request({
      url: '/api/RepFutureFlightSell/excel1',
      method: 'get',
      params: query
    })
  }
