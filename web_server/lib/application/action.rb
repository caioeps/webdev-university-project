class Application
  module Action
    def _call
      call

      [
        status,
        headers,
        body
      ]
    end

    private

    def status
      @status || 200
    end

    def headers
      @headers ||= {}
    end

    def set_content_type
      headers['Content-Type'] = 'text/html'
    end
  end
end
