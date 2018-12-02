module Example
  module Controllers
    module Home
      class Index
        include Framework::Action

        content_type 'text/html'

        def call(env)
          self.body = self.class.to_s
        end
      end
    end
  end
end

