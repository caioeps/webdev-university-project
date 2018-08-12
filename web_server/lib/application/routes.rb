# frozen_string_literal: true

class Application
  class Routes
    RouteNotFound = Class.new(StandardError)

    def action(env)
      method = env['METHOD']
      path   = env['PATH']

      drawn_routes[method].each do |url_regex, action|
        return action.new if path =~ url_regex
      end

      raise "Couldn't find action for #{method} #{path}"
    end

    def drawn_routes
      {
        'GET' => [
          [%r{\/$}, Example::Controllers::Home::Index]
        ]
      }
    end
  end
end
