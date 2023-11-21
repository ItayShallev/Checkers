<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="Checkers.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Checkers</title>
    <link rel="stylesheet" href="./Style/style.css" />
    <link rel="icon" type="image/x-icon" href="./Style/icon.ico" />
</head>
<body>
    <form id="form1" runat="server">
        <br />
        <br />
        <div>
            <asp:Button CssClass="submit-button centered-div" Text="Start" runat="server" OnClick="redirectToGame"/>
        </div>
    </form>
</body>
</html>
