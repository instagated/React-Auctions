<h1 align="center">Documentation</h1>

#### Authentification

| Error                 |                            Meaning                            |
| --------------------- | :-----------------------------------------------------------: |
| `auth/user-not-found` |           The user isn't registered in our database           |
| `auth/user-disabled`  | The account got disabled by the administrator of this website |
| `auth/wrong-password` |             You have entered an invalid password              |

#### Offer

##### Auction

| Error                           |                                Meaning                                 |
| ------------------------------- | :--------------------------------------------------------------------: |
| `offer/offer-is-not-an-auction` | The offer is not an auction. The offer can only get purchased directly |
| `offer/no-bids-placed`          |                   The offer hasn't received any bids                   |
