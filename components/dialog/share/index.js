import { queryReportSubmit } from "../../../utils/api";
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    getSubmit(e) {
      queryReportSubmit(e);
    },
    handleCloseDialog() {
      this.triggerEvent("shareHide");
    },
    handleSharePoster() {
      this.triggerEvent("sharePoster");
    },
    bindtouchstart() {
      setTimeout(() => {
        this.triggerEvent("shareHide");
      }, 300);
    }
  }
});
