<template>
  <div>
    <keep-alive exclude="Search,SearchResult,Detail,UserEdit">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { getAllChannelsAPI } from "@/api";
export default {};
</script>

<style>
</style>