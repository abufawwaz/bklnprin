import React, { Component } from "react";
import Axios from "axios";
import { AppContext } from "./Context";
class UsersList extends Component {
  static contextType = AppContext;
  state = {
    orders: []
  };
  fetchUsers = () => {
    fetch("https://www.bakulansayur.com/apicart/all-users.php")
      .then((response) => {
        response.json().then(
          function (data) {
            if (data.success === 1) {
              this.setState({
                orders: data.orders.reverse()
              });
            } else {
              this.context.post_show(false);
            }
          }.bind(this)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.fetchUsers();
  }
  printpage = (idprint) => {
    var urlprint = "https://www.bakulansayur.com/apicart/print.php?id=";

    window.open(urlprint + idprint, "blank");
  };
  handleUpdate = (id) => {
    Axios.post("https://www.bakulansayur.com/apijs/update-user.php", {
      id: id,
      user_name: this.name.value,
      user_email: this.email.value
    })
      .then(({ data }) => {
        if (data.success === 1) {
          let users = this.state.users.map((user) => {
            if (user.id === id) {
              user.user_name = this.name.value;
              user.user_email = this.email.value;
              user.isEditing = false;
              return user;
            }
            return user;
          });
          this.setState({
            users
          });
        } else {
          alert(data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editMode = (id) => {
    let users = this.state.users.map((user) => {
      if (user.id === id) {
        user.isEditing = true;
        return user;
      }
      user.isEditing = false;
      return user;
    });

    this.setState({
      users
    });
  };

  cancleEdit = (id) => {
    let users = this.state.users.map((user) => {
      if (user.id === id) {
        user.isEditing = false;
        return user;
      }
      return user;
    });
    this.setState({
      users
    });
  };

  handleDelete = (id) => {
    let deleteUser = this.state.users.filter((user) => {
      return user.id !== id;
    });

    Axios.post("https://www.bakulansayur.com/apijs/delete-user.php", {
      id: id
    })
      .then(({ data }) => {
        if (data.success === 1) {
          this.setState({
            users: deleteUser
          });
        } else {
          alert(data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidUpdate() {
    let newUser = this.context.new_user;
    if (newUser) {
      this.setState({
        users: [newUser, ...this.state.users]
      });
      this.context.new_user = false;
    }
  }

  render() {
    let allUsers = this.state.orders.map(
      (
        {
          order_id,
          firstname,
          lastname,
          telephone,
          date_added,
          payment_address_1,
          total,
          belanja,
          isEditing
        },
        index
      ) => {
        let totalhrg = parseInt(total, 10);
        return isEditing === true ? (
          <div class="list-group-flush">
            <div class="list-group-item">
              <tr key={order_id}>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    ref={(item) => (this.name = item)}
                    defaultValue={firstname}
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="email"
                    ref={(item) => (this.email = item)}
                    defaultValue={telephone}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success mr-2"
                    onClick={() => this.handleUpdate(order_id)}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => this.cancleEdit(order_id)}
                    className="btn btn-light"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </div>
          </div>
        ) : (
          <div class="card border-primary mb-3">
            <div class="card-header active">
              <h5 class="card-title">
                <i
                  key={order_id}
                  classname="fab fa-slack-hash fa-2x mr-4 mr-4 red p-1 white-text rounded"
                  aria-hidden="true"
                ></i>
                Pelanggan : {firstname} {lastname}
              </h5>
              <p class="mb-0">
                <i
                  class="fab fa-slack-hash fa-2x mr-4 mr-4 red p-1 white-text rounded"
                  aria-hidden="true"
                ></i>
                Hp: {telephone}{" "}
              </p>
              <p class="mb-0">
                {" "}
                <i
                  class="fab fa-slack-hash fa-2x mr-4 mr-4 red p-1 white-text rounded"
                  aria-hidden="true"
                ></i>
                Alamat : {payment_address_1}
              </p>
            </div>
            <div class="card-body">
              <h5 class="card-title">Belanjaan Tgl :{date_added}</h5>
              <ul>
                {belanja.map((item, i) => {
                  return (
                    <li key={i}>
                      {item.quantity} {item.model} Rp.{" "}
                      {parseInt(item.price, 10)}
                    </li>
                  );
                })}
              </ul>
              <p>Total Belanja Rp. {totalhrg}</p>

              <p class="mb-0">
                <button
                  className="btn btn-danger"
                  onClick={() => this.printpage(order_id)}
                >
                  Lihat
                </button>
                {"     "}
                <button
                  className="btn btn-danger"
                  onClick={() => this.printpage(order_id)}
                >
                  Print
                </button>{" "}
              </p>
            </div>
          </div>
        );
      }
    );

    return <>{allUsers}</>;
  }
}

export default UsersList;
