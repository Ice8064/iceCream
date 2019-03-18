Component({
  properties: {
    data: {
      type: Object,
      value: {}
    },
    index: {
      type: String,
      value: 0
    }
  },
  data: {},
  ready: function() {},

  methods: {
    handleToDetail() {
      wx.navigateTo({ url: `/pages/home/detail/index?itemId=${this.data.data.id}` });
    }
  }
});
