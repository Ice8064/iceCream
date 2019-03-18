import { queryReportSubmit } from "../../utils/api";
Component({
  properties: {
    pageData: {
      type: Array,
      value: []
    },
    title: {
      type: String,
      value: "相似商品"
    },
    isLoading: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    getSubmit(e) {
      queryReportSubmit(e);
    },
    handleToDetail(e) {
      const item = e.currentTarget.dataset.item;
      wx.navigateTo({ url: `/pages/home/detail/index?itemId=${item.id}` });
    }
  }
});
