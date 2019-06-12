import { getParams } from './utils'

describe('Utility Test', () => {
  it('should able to get url parameters from window.location.search', () => {
    expect(getParams('?state=active')).toStrictEqual({
      state: 'active'
    })

    expect(getParams('state=disabled')).toStrictEqual({
      state: 'disabled'
    })

    expect(getParams('?access_token=1234&error=403&error_description=<p>opps</p>')).toStrictEqual({
      access_token: '1234',
      error: '403',
      error_description: '<p>opps</p>'
    })
  })
})
