// Provide Message constructor
function Message(message, detail, severity) {
  this.message = message;
  this.detail = detail;
  this.severity = severity;
}
// class Message {
//   constructor(message, detail, severity) {
//     this.message = message;
//     this.detail = detail;
//     this.severity = severity;
//   }
// }

module.exports = Message;
