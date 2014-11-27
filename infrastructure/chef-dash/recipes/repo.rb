#
# Cookbook Name:: chef-dash
# Recipe:: repo
#
# Copyright 2014 pingworks - Alexander Birk und Christoph Lukas
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

apt_package 'apache2'

template "/etc/apache2/conf.d/repo" do
  source 'confd_repo_alias.erb'
  owner "root"
  group "root"
  mode '644'
end

bash 'apache2_restart' do
  code 'service apache2 restart'
end

user node['chef-dash']['repo']['owner'] do
  comment 'Repo User'
  shell '/bin/bash'
  home node['chef-dash']['repo']['dir']
end

directory node['chef-dash']['repo']['dir'] do
  owner node['chef-dash']['repo']['owner']
  group node['chef-dash']['repo']['group']
  mode '0755'
  recursive true
end


