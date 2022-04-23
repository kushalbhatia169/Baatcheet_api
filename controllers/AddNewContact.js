const Contacts = require("../models/Contacts");

class AddNewContact {
  async addNewContact(req) {
    console.log(req.body)
    const contacts = new Contacts(req.body);  // create a new instance of the Contacts model
    return contacts
      .save()
      .then((contacts) => {
        return contacts;
      })
      .catch(err => { return new Error(err) }); // return the new contact
  }
}

module.exports = AddNewContact;