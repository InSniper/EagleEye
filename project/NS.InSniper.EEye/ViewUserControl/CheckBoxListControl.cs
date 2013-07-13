using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Web.Mvc;
using System.Web.UI;

namespace Boss.Ticketing.Web.ViewUserControl
{
    public class CheckBoxListBuilder<T> : WidgetBuilderBase<CheckBoxList<T>, CheckBoxListBuilder<T>> where T : struct
    {
        public CheckBoxListBuilder(): base()
        {
            
        }

        private String m_valueField = null;
        private String m_textField = null;
        private IEnumerable m_bindTo = null;
        private ICollection<int> m_selectedIndex = null;
        private ICollection m_selectedValue = null;

        /*public CheckBoxListBuilder(CheckBoxList<T> component)
            : base("ul", component)
        {
        }*/

        public CheckBoxListBuilder<T> SelectedIndex(ICollection<int> index)
        {
            m_selectedIndex = index;
            m_selectedValue = null;
            return (this);
        }

        public CheckBoxListBuilder<T> SelectedValue(ICollection value)
        {
            m_selectedValue = value;
            m_selectedIndex = null;
            return (this);
        }
        
        public CheckBoxListBuilder<T> DataTextField(String textField)
        {
            m_textField = textField;
            return (this);
        }
         
        public CheckBoxListBuilder<T>  DataValueField(String valueField)
        {
            m_valueField = valueField;
            return (this);
        }

        public CheckBoxListBuilder<T> BindTo(IEnumerable bindTo)
        {
            m_bindTo = bindTo;
            return (this);
        }

        protected override void Initialise()
        {
            base.Initialise();
            AddHtmlCssClass("x-checkbox-list-container");
        }

        protected override String RenderInnerHtml()
        {
            if (null != m_bindTo)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("<ul class='x-checkbox-list'>");

                var nIndex = 0;
                foreach (var item in m_bindTo)
                {
                    String valueField =(item.GetType().GetProperty(m_valueField)).GetValue(item,null).ToString();
                    String textField =(item.GetType().GetProperty(m_textField)).GetValue(item,null).ToString();
                    
                    String selected = "";
                    if ((m_selectedValue != null && ((ICollection<String>)m_selectedValue).Contains(valueField)) || (m_selectedIndex!=null && m_selectedIndex.Contains(nIndex)))
                        selected = "isChecked";

                    sb.Append("<li class='x-checkbox-list-item'>");
                    sb.Append("<label class='x-checkbox-list-item'>");
                    sb.Append("<input type='button' id='" + valueField + "'" + " class='" + selected  + "'" + " >");
                    sb.Append("<span for='" + valueField + "'>" + textField + "</span>");
                    sb.Append("</li>");

                    nIndex++;
                }
                sb.Append("</ul>");

                TagBuilder scriptTag = new TagBuilder("script");
                scriptTag.InnerHtml = @"
                require(['jquery', 'Xero.View.CheckBoxList'], function($){
                    $(document).ready(function()                        {
                        var  " +this.GetCompoenentName()+ @" = new Xero.Views.CheckBoxListContainer({el : $('#" + this.GetCompoenentName() + @"')});
                    });
                });";
                sb.Append(scriptTag.ToString());

                return (sb.ToString());
            }
            return (base.RenderInnerHtml());
        }

        /*public CheckBoxListBuilder<T> Value(T? value);
        public CheckBoxListBuilder<T> Step(T step);
        public CheckBoxListBuilder<T> Min(T? min);
        public CheckBoxListBuilder<T> Max(T? max);
        public CheckBoxListBuilder<T> Placeholder(string placeholder);
        public CheckBoxListBuilder<T> Spinners(bool value);
        public CheckBoxListBuilder<T> Events(Action<NumericTextBoxEventBuilder> EventsAction);
        public CheckBoxListBuilder<T> Enable(bool value);
        public CheckBoxListBuilder<T> Format(string format);
        public CheckBoxListBuilder<T> Culture(string culture);
        public CheckBoxListBuilder<T> Decimals(int decimals);
        public CheckBoxListBuilder<T> IncreaseButtonTitle(string title);
        public CheckBoxListBuilder<T> DecreaseButtonTitle(string title);*/
    }


    public class CheckBoxList<T> : WidgetBase, IWidget, IHtmlAttributesContainer, IInputComponent<T> where T : struct
    {
        public CheckBoxList(ViewContext viewContext, IJavaScriptInitializer javaScriptInitializer,
                            ViewDataDictionary viewData)
        {

        }

        /*public override void WriteInitializationScript(TextWriter writer)
        {
            
        }

        protected override void WriteHtml(HtmlTextWriter writer)
        {
            
        }
        public override void VerifySettings()
        {
            
        }*/
        public T? Value { get; set; }
        /*public T? Step { get; set; }
        public T? Min { get; set; }
        public T? Max { get; set; }
        public int? Decimals { get; set; }
        public string Format { get; set; }
        public string Culture { get; set; }
        public string Placeholder { get; set; }
        public string IncreaseButtonTitle { get; set; }
        public string DecreaseButtonTitle { get; set; }
        public bool? Spinners { get; set; }
        public bool Enabled { get; set; }*/
    }


}