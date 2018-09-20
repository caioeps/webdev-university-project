# All controllers in the application must include this module.
module Framework::Action
  def self.included(base)
    base.extend ClassMethods
  end

  def process_request(env)
    set_content_type
    call(env)

    [
      status,
      headers,
      [body]
    ]
  end

  class << self
  end

  private

  attr_accessor :status, :headers, :body

  def status
    @status || 200
  end

  def headers
    @headers ||= {}
  end

  def body
    @body ||= view_class.new(locals).render
  end

  def set_content_type
    headers['Content-Type'] = self.class.content_type
  end

  def view_class
    self_klass = self.class.to_s
    self_klas.split('::').map do |part|
      return 'Views' if part == 'Controllers'
      part
    end
  end

  def locals
    self.class
  end

  module ClassMethods
    attr_reader :exposed_vars

    def content_type(type = nil)
      if type
        @content_type = type.to_s
      else
        @content_type || 'text/html'
      end
    end

    def expose(*variables)
      @exposed_vars = variables
    end

    def exposed_vars
      @exposed_vars || []
    end
  end
end
