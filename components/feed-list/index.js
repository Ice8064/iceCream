import { queryReportSubmit } from "../../utils/api";
Component({
  properties: {
    pagedata: {
      type: Object,
      value: {}
    },
    isLoading: {
      type: String,
      value: 0
    }
  },

  methods: {
    getSubmit(e) {
      queryReportSubmit(e);
    },
    goToDetail(e) {
      const item = e.currentTarget.dataset.item;
      wx.navigateTo({ url: `/pages/home/detail/index?itemId=${item.id}` });
    }
  }
});
