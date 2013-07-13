using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.UI;
using Boss.Ticketing.Web.Exceptions;
using Boss.Ticketing.Web.Helpers;

namespace Boss.Ticketing.Web.ViewUserControl
{
    public interface IInputComponent<T> : IWidget, IHtmlAttributesContainer where T : struct
    {
        T? Value { get; set; }
    }

    public interface IJavaScriptSerializer
    {
        string Serialize(object value);
    }
    
    public interface IJavaScriptInitializer
    {
        IJavaScriptSerializer CreateSerializer();
        string Initialize(string id, string name, IDictionary<string, object> options);
        string Serialize(IDictionary<string, object> value);
    }
    
    public interface IScriptableComponent
    {
        void WriteInitializationScript(TextWriter writer);
        bool IsSelfInitialized { get; }
        bool IsInClientTemplate { get; }
        string Selector { get; }
    }
    
    public interface IHtmlAttributesContainer
    {
        IDictionary<string, object> HtmlAttributes { get; }
    }
    
    public interface IWidget : IHtmlAttributesContainer
    {
        string Id { get; }
        string Name { get; }
        ModelMetadata ModelMetadata { get; }
        ViewContext ViewContext { get; }
        ViewDataDictionary ViewData { get; }
    }
    
    public abstract class WidgetBase : IWidget, IHtmlAttributesContainer, IScriptableComponent
    {
        /*protected WidgetBase(ViewContext viewContext, ViewDataDictionary viewData = null);
        protected WidgetBase(ViewContext viewContext, IJavaScriptInitializer initializer, ViewDataDictionary viewData = null);
        public void Render();*/
        public virtual void WriteInitializationScript(TextWriter writer)
        {
            
        }
        /*public virtual void VerifySettings();
        public string ToHtmlString();
        protected virtual void WriteHtml(HtmlTextWriter writer);
        public MvcHtmlString ToClientTemplate();
        public IJavaScriptInitializer Initializer { get; set; }
        public IDictionary<string, object> Events { get; }*/
        public string Name { get; set; }
        public string Id
        {
            get { return (null); }
        }

        public ModelMetadata ModelMetadata { get; set; }
        public IDictionary<string, object> HtmlAttributes
        {
            get { return (null); }
        }
        public ViewContext ViewContext
        {
            get { return (null); }
        }

        public ViewDataDictionary ViewData
        {
            get { return (null); }
        }

        public bool IsSelfInitialized
        {
            get { return (false); }
        }

        public bool IsInClientTemplate
        {
            get { return (false); }
        }

        public string Selector
        {
            get { return (null); }
        }

    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public interface IHideObjectMembers
    {
        [EditorBrowsable(EditorBrowsableState.Never)]
        bool Equals(object value);
        [EditorBrowsable(EditorBrowsableState.Never)]
        int GetHashCode();
        [EditorBrowsable(EditorBrowsableState.Never)]
        Type GetType();
        [EditorBrowsable(EditorBrowsableState.Never)]
        string ToString();
    }

    public abstract class WidgetBuilderBase<TViewComponent, TBuilder> : IHtmlString, IHideObjectMembers
        where TViewComponent : WidgetBase
        where TBuilder : WidgetBuilderBase<TViewComponent, TBuilder>
    {
        
        public WidgetBuilderBase(String tagName = "div",TViewComponent component=null)
        {
            TagName = tagName;
        }


        private IDictionary<string, string> m_Attributes;
        private string TagName { get; set; }
        private TagRenderMode TagRenderMode { get; set; }
        private String ComponentName { get; set; }

        protected String GetCompoenentName()
        {
            return (this.ComponentName);
        }

        public virtual TBuilder Name(string componentName)
        {
            this.ComponentName = componentName.Trim();
            GetAttributes().Merge("id", this.ComponentName);
            return ((TBuilder)this);
        }

        protected IDictionary<String, String> GetAttributes()
        {
            if(m_Attributes==null)
                m_Attributes = new SortedDictionary<string, string>(StringComparer.Ordinal);
            return (m_Attributes);
        }

        public virtual TBuilder HtmlCssClass(String htmlCssClass)
        {
            GetAttributes().Merge("class",htmlCssClass.Trim());
            return ((TBuilder)this);
        }

        public virtual TBuilder AddHtmlCssClass(String htmlCssClass)
        {
            String currentHtmlCssClass = "";
            if(GetAttributes().TryGetValue("class", out currentHtmlCssClass))
                currentHtmlCssClass = currentHtmlCssClass.Trim() + " " + htmlCssClass.Trim();
            else
                currentHtmlCssClass = htmlCssClass.Trim();
            return (HtmlCssClass(currentHtmlCssClass));
        }

        public virtual TBuilder HtmlAttributes(IDictionary<string, object> attributes)
        {
            foreach (var attribute in attributes)
            {
                if (String.Equals(attribute.Key, "class", StringComparison.InvariantCultureIgnoreCase) ||
                    String.Equals(attribute.Key, "id", StringComparison.InvariantCultureIgnoreCase))
                    throw new ParameterValueException("You can not set " + attribute.Key + " usting HtmlAttribute");

                GetAttributes().Merge(attribute.Key,attribute.Value);
            }
            return ((TBuilder)this);
        }

        //public virtual void Render();

        public string ToHtmlString()
        {
            StringBuilder html = new StringBuilder();

            Initialise();

            TagBuilder tagBuilder = GetTagBuilder();

            using (StringWriter writer = new StringWriter(html))
            {
                writer.Write(tagBuilder.ToString(TagRenderMode));

                RenderHtml(writer);
            }

            return html.ToString();
        }

        // Override if the control needs access to the ViewContext.
        protected virtual void Initialise()
        {
            if(String.IsNullOrEmpty(this.ComponentName))
                this.Name(Guid.NewGuid().ToString());//Generate Temp id for componenet
            
        }

        // Override if the control needs to render some custom HTML (e.g. MvcCheckBox).
        protected virtual void RenderHtml(StringWriter writer) { }

        // Override if the control needs to render some custom HTML (e.g. MvcCheckBox).
        protected virtual String RenderInnerHtml()
        {
            return ("");
        }

        public override string ToString()
        {
            return (this.ToHtmlString());
        }

        //public static implicit operator TViewComponent(WidgetBuilderBase<TViewComponent, TBuilder> builder);*/
        //public TViewComponent ToComponent();
        /*Type IHideObjectMembers.GetType();
        public MvcHtmlString ToClientTemplate();
        protected internal TViewComponent Component { get; set; }*/

        private TagBuilder GetTagBuilder()
        {
            TagBuilder tagBuilder = new TagBuilder(TagName);
            //tagBuilder.MergeAttributes(new RouteValueDictionary(GetAttributes()));
            tagBuilder.MergeAttributes(GetAttributes());
            tagBuilder.InnerHtml = RenderInnerHtml();
            
            return tagBuilder;
        }

    }
}