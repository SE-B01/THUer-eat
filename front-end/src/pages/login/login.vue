<template>
	<view class="content">
		<view class="logo">
			<image src="../../static/logo.png" mode=""></image>
		</view>
		<view class="list">
			<view class="title">
				用户名
			</view>
			<view class="input">
				<input type="text" placeholder="请输入用户名" v-model="name" />
			</view>
		</view>
		<view class="list">
			<view class="title">
				密码
			</view>
			<view class="input">
				<input type="text" placeholder="请输入密码" v-model="password" />
			</view>
		</view>
	</view>
</template>