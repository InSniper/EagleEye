using System;
using System.Linq.Expressions;
using System.Web.Mvc;

namespace Boss.Ticketing.Web.ViewUserControl
{
    public class WidgetFactory : IHideObjectMembers
    {
    }

    public class WidgetFactory<TModel> : WidgetFactory
    {
        private HtmlHelper<TModel> htmlHelper = null;

        public WidgetFactory(HtmlHelper<TModel> htmlHelper)
        {
            this.htmlHelper = htmlHelper;
        }

        public CheckBoxListBuilder<TValue> CheckBoxListFor<TValue>(Expression<Func<TModel, TValue?>> expression) where TValue : struct
        {
            return (new CheckBoxListBuilder<TValue>());
        }

        public ComboBoxBuilder<TValue> ComboBoxFor<TValue>(Expression<Func<TModel, TValue?>> expression) where TValue : struct
        {
            return (new ComboBoxBuilder<TValue>());
        }

        //public static HtmlString RenderControl<T>(this HtmlHelper helper, string path)
        //    where T : UserControl
        //{
        //    return RenderControl<T>(helper, path, null);
        //}

        //public static HtmlString RenderControl<T>(this HtmlHelper helper, string path, Action<T> action)
        //    where T : UserControl
        //{
        //    Page page = new Page();
        //    T control = (T)page.LoadControl(path);
        //    page.Controls.Add(control);

        //    if (action != null)
        //        action(control);

        //    using (StringWriter sw = new StringWriter())
        //    {
        //        HttpContext.Current.Server.Execute(page, sw, false);
        //        return new HtmlString(sw.ToString());
        //    }
        //}
    }
}