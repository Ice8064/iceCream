import homeAPI from "../../../../../server/API/homeAPI";

Component({
  data: {
    list: []
  },
  ready() {
    this.getData();
  },

  methods: {
    getData() {
      homeAPI.getBoostAssetWithdrawflows().then(res => {
        this.setData({
          list: res
        });
      });
    }
  }
});
