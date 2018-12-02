# frozen_string_literal: true

$LOAD_PATH.unshift(File.expand_path('../..', __dir__))

require 'bundler'
require 'pathname'

require_relative './framework'

Bundler.require(:default)

class Application
  def initialize
    load_dependencies
  end

  class << self
    def env
      @env ||= ENV['APPLICATION_ENV'] || 'development'
    end
  end

  def call(env)
    routes.action(env).process_request(env)
  end

  def routes
    @routes ||= Routes.new
  end

  def root
    @root ||= Pathname.new File.expand_path('..', __dir__)
  end

  private

  def load_dependencies
    puts 'Loading application files...'
    Dir.glob(root + 'apps/**/controllers/**/*.rb') do |filename|
      puts "  Loading #{filename}"
      require filename
    end
    puts 'Done.'
  end
end

require_relative './application/routes'
