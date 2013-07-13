using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Boss.Ticketing.Web.ViewUserControl
{
    internal interface  IUserControl
    {
        String Render();
    }
}