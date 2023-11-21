using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Threading;

namespace Checkers
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        string firstName = "";
        string lastName = "";
        string email = "";
        string password = "";

        // ALLOWED USER
        ////////////////////////////////////////////////
        string allowedUserEmail = "admin@gmail.com";
        string allowedUserPassword = "admin";
        ////////////////////////////////////////////////

        protected void Page_Load(object sender, EventArgs e)
        {
            firstName = Request.QueryString["fname"];
            lastName = Request.QueryString["lname"];
            email = Request.QueryString["email"];
            password = Request.QueryString["password"];

            Response.Write("<div class='centered-div regular-text' style='top: 30%'>" +
                "Welcome " + firstName + " " + lastName +
                "</div>");
        }

        protected void redirectToGame(object sender, EventArgs e)
        {
            if (email == allowedUserEmail && password == allowedUserPassword)
            {
                Response.Redirect("./Home/home.html");
            }
            else
            {
                Response.Write("<div class='centered-div regular-text' style='top:35%; color: red'>Error: User Not Found</div>");

                //Thread.Sleep(2000);
                //Response.Redirect("./Register/Register.html");
            }
        }
    }
}