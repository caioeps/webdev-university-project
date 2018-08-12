# frozen_string_literal: true

require 'socket'
require 'rack'

class HTTPServer
  def initialize(app)
    @app = app
  end

  def run
    each_request do |conn|
      request = conn.gets

      method, full_path = request.split(' ')

      path, query = full_path.split('?')

      status, headers, body = @app.call(
        'METHOD'       => method,
        'PATH'         => path,
        'QUERY_STRING' => query
      )

      conn.print build_response(status, headers, body)
    end
  end

  private

  def server
    @server ||= TCPServer.new 3000
  end

  def each_request
    puts 'Starting HTTPServer. Waiting for requests.'

    loop do
      Thread.start(server.accept) do |conn|
        begin
          yield conn
        rescue Exception => e
          conn.puts error_response(e)
        ensure
          conn.close
        end
      end
    end
  rescue Interrupt
    puts "\nShutting down server... Bye!"
    exit 130
  end

  def error_response(exception)
    headers = {
      'Content-Type' => 'text/html'
    }

    body = ([exception.message] << exception.backtrace)

    html = body.join('<br/>')

    build_response(500, headers, [html])
  end

  def build_response(status, headers, body)
    <<~RESPONSE
      HTTP/1.1 #{status}
      #{headers.map { |key, value| "#{key}: #{value}" }.join("\n")}

      #{body.join("\n")}
    RESPONSE
  end
end

