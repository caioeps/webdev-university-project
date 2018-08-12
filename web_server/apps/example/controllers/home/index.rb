module Example
  module Controllers
    module Home
      class Index
        include Application::Action

        def call(env)
          self.body = 'Hi, there.'
        end
      end
    end
  end
end

