require_relative '../spec_helper'

describe process 'apache' do
  it { should be_runnning }
end

describe package 'apache2-mpm-prefork' do
  it { should be_installed }
end

describe file '/etc/apache2/sites-available/default' do
  its (:content) { should match /DocumentRoot \/opt\/dash\/public/ }
  its (:content) { should match /SetEnv APPLICATION_ENV "production"/ }
end

