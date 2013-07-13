using System;
using System.Collections;
using System.IO;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Web.Mvc;
using System.Web.UI;

namespace Boss.Ticketing.Web.ViewUserControl
{
    public class ComboBoxBuilder<T> : WidgetBuilderBase<ComboBox<T>, ComboBoxBuilder<T>> where T : struct
    {
        public ComboBoxBuilder(): base()
        {
            
        }

        private String m_valueField = null;
        private String m_textField = null;
        private IEnumerable m_bindTo = null;
        private int? m_selectedIndex = null;
        private Object m_selectedValue = null;
        private String m_selectedAllValue = null;
        private String m_selectedAllText = null;

        /*public ComboBoxBuilder(ComboBox<T> component)
            : base("ul", component)
        {
        }*/

        public ComboBoxBuilder<T> SelectedIndex(int index)
        {
            m_selectedIndex = index;
            m_selectedValue = null;
            return(this);
        }

        public ComboBoxBuilder<T> SelectedValue(Object value)
        {
            m_selectedValue = value;
            m_selectedIndex = null;
            return (this);
        }

        public ComboBoxBuilder<T> DataTextField(String textField)
        {
            m_textField = textField;
            return (this);
        }
         
        public ComboBoxBuilder<T>  DataValueField(String valueField)
        {
            m_valueField = valueField;
            return (this);
        }

        public ComboBoxBuilder<T> BindTo(IEnumerable bindTo)
        {
            m_bindTo = bindTo;
            return (this);
        }

        public ComboBoxBuilder<T> AllSelection(String allText,String allValue)
        {
            m_selectedAllValue = allValue;
            m_selectedAllText = allText;
            return (this);
        }

        protected override void Initialise()
        {
            base.Initialise();
            //AddHtmlCssClass("x-checkbox-list-container");
        }

        protected override String RenderInnerHtml()
        {
            if (null != m_bindTo)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("<select id='" + this.GetCompoenentName() + "_select'>");

                if (m_selectedAllValue != null || m_selectedAllText!=null)
                {
                    String selected = "";
                    if ((m_selectedValue != null && m_selectedValue.ToString().Equals(m_selectedAllValue, StringComparison.InvariantCulture)))
                        selected = "selected='selected'";

                    sb.Append("<option value = '" + m_selectedAllValue + "' " + selected + ">");
                    sb.Append(m_selectedAllText);
                    sb.Append("</option>");
                }

                int nIndex = 0;
                foreach (var item in m_bindTo)
                {
                    String valueField =(item.GetType().GetProperty(m_valueField)).GetValue(item,null).ToString();
                    String textField =(item.GetType().GetProperty(m_textField)).GetValue(item,null).ToString();

                    String selected = "";
                    if ((m_selectedValue != null && m_selectedValue.ToString().Equals(valueField,StringComparison.InvariantCulture)) || (m_selectedIndex != null && nIndex == m_selectedIndex))
                        selected = "selected='selected'";
                    

                    sb.Append("<option value = '" + valueField + "' " + selected +  ">");
                    sb.Append(textField);
                    sb.Append("</option>");

                    nIndex++;
                }
                sb.Append("</select>");

                TagBuilder scriptTag = new TagBuilder("script");
                scriptTag.InnerHtml = string.Format(@"
                require(['jquery', 'chosen'], function($){{
                    $(document).ready(function()    {{  
                        $('#{0}_select').chosen({{ disable_search: $('#{0}_select').children().length <= 20 ? true : false, allow_single_deselect: true }});
                    }});
                }});", this.GetCompoenentName());
                sb.Append(scriptTag.ToString());

                return (sb.ToString());
            }
            return (base.RenderInnerHtml());
        }

    }


    public class ComboBox<T> : WidgetBase, IWidget, IHtmlAttributesContainer, IInputComponent<T> where T : struct
    {
        public ComboBox(ViewContext viewContext, IJavaScriptInitializer javaScriptInitializer,
                            ViewDataDictionary viewData)
        {

        }

        public T? Value { get; set; }
    }


}