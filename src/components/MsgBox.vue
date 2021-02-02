<template>

</template>


<script>
export default {
  name: "MsgBox",
  data() {
    return {
      userGender:""
    }
  },
  methods: {
    nextStep: function () {
      $(".userGenderChoose").fadeIn();
    }
  }
}
</script>
