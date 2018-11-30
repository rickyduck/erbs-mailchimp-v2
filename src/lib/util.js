import request from "request";
import { RefCountDisposable } from "rx";

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
const listId = "3df5ec3a79";
const url = `https://us19.api.mailchimp.com/3.0/lists/${listId}/members/`;
export async function getList() {
  const API_KEY = "c7ba19913abe52e33f2a9c4c993d8e2c-us19";
  const results = await new Promise((resolve, reject) => {
    request.get(
      {
        uri: url,
        headers: {
          Accept: "application/json",
          Authorization: `Basic c7ba19913abe52e33f2a9c4c993d8e2c-us19`
        },
        json: true
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          //console.log(response);
          resolve(response);
        }
      }
    );
  });
  return results;
}
