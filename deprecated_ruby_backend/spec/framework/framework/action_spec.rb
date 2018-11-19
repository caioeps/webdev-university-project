require 'framework_helper'

RSpec.describe Framework::Action do
  before do
    module Aaaa::Controllers::Home
      class Index
      end
    end
  end

  after do
    Object.send(:remove_const, :'Aaaa::Controllers::Home::Index')
  end
end
