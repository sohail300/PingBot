from jinja2 import Template

def dynamic_content(content, values):
    template = Template(content)
    dynamic_content = template.render(**values)

    return dynamic_content