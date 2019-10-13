const Store = require('electron-store');
const store = new Store();

class Collections {
  constructor(title) {
    this.id = this.generateID()
    this.title = title
    this.items = []
    this.modelName = "collections"
  }



  save() {
    store.set("collections", { id: this.id, title: this.title, items: this.items, model: this.modelName })
  }
}
